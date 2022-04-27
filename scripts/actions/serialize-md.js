const handlers = require('./utils/handlers');
const fencedCodeBlock = require('../../codemods/fencedCodeBlock');
const unified = require('unified');
const toMDAST = require('remark-parse');
const frontmatter = require('remark-frontmatter');
const remark2rehype = require('remark-rehype');
const addClasses = require('rehype-add-classes');
const html = require('rehype-stringify');
const format = require('rehype-format');
const customHeadingIds = require('../../plugins/gatsby-remark-custom-heading-ids/utils/visitor');

const testmd = `---
title: "Tracing the gap: AWS X-Ray integration"
summary: "Use New Relic with AWS X-Ray, a critical distributed tracing tool for getting visibility across your AWS services."
releaseDate: "2020-08-16"
learnMoreLink: "https://blog.newrelic.com/product-news/aws-x-ray-integration/"
getStartedLink: "https://docs.newrelic.com/docs/integrations/amazon-integrations/aws-integrations-list/aws-x-ray-monitoring-integration"
---

Whether you’re managing Amazon EC2 instances or writing AWS Lambda functions, AWS X-Ray is a critical distributed tracing tool for getting visibility across your AWS services, but it doesn’t automatically capture all calls outside of AWS.

Conversely, New Relic Distributed Tracing provides automatic tracing for any application where the New Relic agent is installed—including on-prem and monolithic applications. One thing it lacked was visibility into trace and performance data from AWS-managed services where the agent couldn’t be installed.

Now, you can combine New Relic Distributed Tracing and AWS X-Ray into a single, seamless experience. Automatically see an end-to-end view of requests as they travel through their applications, along with filtering, querying, and visualizing trace data to quickly debug issues.

This update brings rich trace data for AWS-managed services so you can get insight into how services—like AWS Lambda, Amazon Simple Queue Service, Amazon API Gateway, or Amazon DynamoDB—are contributing to your total transaction time or possibly causing errors.

## Get started

If you’re an existing New Relic user and you’ve already [connected your AWS account](https://docs.newrelic.com/docs/integrations/amazon-integrations/get-started/connect-aws-infrastructure), go to your [New Relic Infrastructure AWS settings](https://infrastructure.newrelic.com) and activate X-Ray (see below).

![Infrastructure_integrations_AWS_x-ray.png](./images/Infrastructure_integrations_AWS_x-ray.png "Infrastructure_integrations_AWS_x-ray.png")

After you enable the X-Ray integration, AWS X-Ray trace data will automatically display in any distributed tracing view throughout New Relic One.`;

const processor = unified()
  .use(toMDAST)
  .use(frontmatter, ['yaml'])
  .use(fencedCodeBlock)
  .use(customHeadingIds)
  .use(remark2rehype, {
    handlers: {
      yaml: handlers.frontmatter.serialize,
    },
  })
  .use(format)
  .use(html)
  .use(addClasses, {
    // adds notranslate class to <code> elements
    code: 'notranslate',
  });

const serializeMD = async () => {
  const { contents } = await processor.process(testmd);
  console.log('helloooo', contents);

  return contents;
};

serializeMD();
module.exports = serializeMD;
