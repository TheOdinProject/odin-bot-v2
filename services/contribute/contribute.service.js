const Redis = require('ioredis');
const { CronJob } = require('cron');

class ContributeService {
  constructor(client, contributingChannelId) {
    this.redis = new Redis(process.env.REDIS_URL);
    this.client = client;
    this.contributingChannelId = contributingChannelId;
  }

  tenDays = 864000000;

  async schedule() {
    const job = new CronJob(
      '0 12 * * MON', // every Monday at 12:00 PM UTC
      async () => {
        await this.start();
      },
      null,
      true,
      'America/Los_Angeles',
    );
    job.start();
  }

  async start() {
    const issues = (await ContributeService.fetchGoodFirstIssues()).map((i) => ({
      id: i.id,
      html_url: i.html_url,
    }));
    const filtered = await this.filterIssues(issues);
    const issueToSend = ContributeService.issueToSend(issues, filtered);

    if (issueToSend) {
      await this.cacheIssue(issueToSend);
      await this.sendMessage(`Hey everyone! We have a new **Good First Issue** available for you to work on! Check it out here: ${issueToSend.html_url}`);
    } else {
      await this.sendMessage('Hey everyone! We don\'t have any new **Good First Issues** available for you to work on right now. Check back later!');
    }
  }

  static async fetchGoodFirstIssues() {
    const response = await fetch('https://api.github.com/repos/theodinproject/curriculum/issues?labels=Type:%20Good%20First%20Issue');
    const rawIssues = await response.json();
    return rawIssues;
  }

  async sendMessage(message) {
    const channel = this.client.channels.cache.get(this.contributingChannelId);
    await channel.send(message);
  }

  static issueToSend(issues, filtered) {
    if (issues.length === 0) {
      return null;
    }
    if (filtered.length === 0) {
      return issues[0];
    }
    return filtered[0];
  }

  async filterIssues(issues) {
    const filtered = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const issue of issues) {
    // eslint-disable-next-line no-await-in-loop
      const isCached = await this.isIssueCached(issue.id);
      if (!isCached) {
        filtered.push(issue);
      }
    }
    return filtered;
  }

  async cacheIssue(issue) {
    await this.redis.set(issue.id, issue.html_url, 'EX', this.tenDays);
  }

  async isIssueCached(issueId) {
    const issue = await this.redis.get(issueId);
    if (issue) return true;

    return false;
  }
}

module.exports = ContributeService;
