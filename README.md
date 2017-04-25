# Lira Bot
This bot is an uTu example bot that uses the Microsoft Botframework.

## Updating Files
```sh
$ gcloud compute copy-files ./dist package.json process.yml demo-bot-vm:/home/bots/lira --project "principal-bird-145614" --zone "us-central1-f"
```

## SSH
```sh
$ gcloud compute --project "principal-bird-145614" ssh --zone "us-central1-f" "demo-bot-vm"
```
