<h1 align="center">
  S3 Sync OpenAI Vector Store
</h1>

<div align="center">
  Sync the contents of an S3 bucket with an OpenAI vector store
  <br />
</div>

<div align="center">
<br />

[![made with hearth by Eyevinn](https://img.shields.io/badge/made%20with%20%E2%99%A5%20by-Eyevinn-59cbe8.svg?style=flat-square)](https://github.com/eyevinn)
[![Slack](http://slack.streamingtech.se/badge.svg)](http://slack.streamingtech.se)

</div>

Sync the contents of an S3 bucket with an OpenAI vector store

## Requirements

- OpenAI API key
- AWS S3 CLI

## Installation / Usage

Options can be provided either as command line options or environment variables.

```bash
% npx @eyevinn/s3-sync-vectorstore -h
Sync the files on an S3 bucket with an OpenAI vector store

Arguments:
  source                                   Source S3 URL
  vector-store-id                          OpenAI vector store ID

Options:
  --openai-api-key                         OpenAI API key (OPENAI_API_KEY)
  --purpose                                Purpose of the files (OPENAI_PURPOSE)
  --region <region>                        AWS region (AWS_REGION)
  --endpoint <endpoint>                    S3 endpoint (S3_ENDPOINT)
  --access-key-id <access-key-id>          AWS access key ID (AWS_ACCESS_KEY_ID)
  --secret-access-key <secret-access-key>  AWS secret access key (AWS_SECRET_ACCESS_KEY)
  --staging-dir <staging-dir>              Staging directory (STAGING_DIR) (default: "/tmp/data")
  --dry-run                                Dry run
  -h, --help                               display help for command

```

```bash
% export OPENAI_API_KEY=<openai-api-key>
% npx @eyevinn/s3-sync-vectorstore \
  s3://source/files/ vs-3434533213
```

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md)

## License

This project is licensed under the MIT License, see [LICENSE](LICENSE).

# Support

Join our [community on Slack](http://slack.streamingtech.se) where you can post any questions regarding any of our open source projects. Eyevinn's consulting business can also offer you:

- Further development of this component
- Customization and integration of this component into your platform
- Support and maintenance agreement

Contact [sales@eyevinn.se](mailto:sales@eyevinn.se) if you are interested.

# About Eyevinn Technology

[Eyevinn Technology](https://www.eyevinntechnology.se) is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor. As our way to innovate and push the industry forward we develop proof-of-concepts and tools. The things we learn and the code we write we share with the industry in [blogs](https://dev.to/video) and by open sourcing the code we have written.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
