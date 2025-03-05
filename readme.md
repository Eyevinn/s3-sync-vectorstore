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

[![Badge OSC](https://img.shields.io/badge/Evaluate-24243B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8yODIxXzMxNjcyKSIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI3IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPGRlZnM%2BCjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yODIxXzMxNjcyIiB4MT0iMTIiIHkxPSIwIiB4Mj0iMTIiIHkyPSIyNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjQzE4M0ZGIi8%2BCjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzREQzlGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM%2BCjwvc3ZnPgo%3D)](https://app.osaas.io/browse/eyevinn-s3-sync-vectorstore)

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
  s3://source/files/ vs_3434533213
```

You can also sync multiple S3 buckets with one vector store by comma separating the source URLs

```bash
% npx @eyevinn/s3-sync-vectorstore \
  s3://source/files/,s3://source2/files/ vs_3434533213
```

### Running in Eyevinn Open Source Cloud

Available as an open web service in [Eyevinn Open Source Cloud](https://www.osaas.io) if you want to run a job in the cloud without having to setup your own infrastructure for it.

```bash
% export OSC_ACCESS_TOKEN=<your-osc-pat>
% npx -y @osaas/cli@latest create eyevinn-s3-sync-vectorstore ghsync \
    -o cmdLineArgs="s3://source/files vs_3434533213" \
    -o OpenaiApiKey="{{secrets.openaikey}}" \
    -o AwsRegion="eu-north-1" \
    -o AwsAccessKeyId="{{secrets.accesskeyid}}" \
    -o AwsSecretAccessKey="{{secrets.secretaccesskey}}"
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
