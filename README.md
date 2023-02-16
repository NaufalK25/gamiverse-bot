# Gamiverse

[![Invite Discord](https://img.shields.io/badge/-Invite%20Bot-404eed?style=flat&logo=discord&logoColor=white)](https://discord.com/api/oauth2/authorize?client_id=1074237343306883082&permissions=139586956352&scope=bot)
[![Invite Telegram](https://img.shields.io/badge/-Chat%20With%20Bot-24a1dd?style=flat&logo=telegram&logoColor=white)](https://t.me/gamiverse_bot)

Gamiverse is a discord bot that can get player stats from various games and display them in a simple and easy to read format.

## Commands

### General

| Command    | Desciption                                |
| ---------- | ----------------------------------------- |
| `/help`    | Get help for the bot                      |
| `/contact` | Get contact information for the developer |
| `/docs`    | Get documentation for the bot             |

### Game

| Game           | Command                         | Desciption                      | Status             |
| -------------- | ------------------------------- | ------------------------------- | ------------------ |
| Brawl Stars    | `/bs <tag>`                     | Get Brawl Stars player stats    | Temporarily Remove |
| Clash of Clans | `/coc <tag>`                    | Get Clash of Clans player stats | Temporarily Remove |
| Clash Royale   | `/cr <tag>`                     | Get Clash Royale player stats   | Temporarily Remove |
| Chess.com      | `/chess <username>`             | Get Chess.com player stats      | OK                 |
| Destiny 2      | `/d2 <platform> <membershipId>` | Get Destiny 2 player stats      | OK                 |
| PUBG           | `/pubg <platform> <accountId>`  | Get PUBG player stats           | OK                 |
| TETR.io        | `/tetrio <username>`            | Get TETR.io player stats        | OK                 |

> Note: Brawl Stars, Clash of Clans, and Clash Royale commands are temporarily removed due to how the API works.
> The API requires an IP address to be whitelisted before it can be used and when restarting the bot, the IP address changes so I have to manually delete the old API key and create a new one.

## API

| Game           | Documentation                                                    |    Auth     | Official |
| -------------- | ---------------------------------------------------------------- | :---------: | :------: |
| Brawl Stars    | https://developer.brawlstars.com/#/documentation                 |  `Bearer`   |   Yes    |
| Clash of Clans | https://developer.clashofclans.com/#/documentation               |  `Bearer`   |   Yes    |
| Clash Royale   | https://developer.clashroyale.com/#/documentation                |  `Bearer`   |   Yes    |
| Chess.com      | https://www.chess.com/news/view/published-data-api               |   `None`    |   Yes    |
| Destiny 2      | https://bungie-net.github.io/multi/                              | `x-api-key` |   Yes    |
| PUBG           | https://documentation.playbattlegrounds.com/en/introduction.html |  `Bearer`   |   Yes    |
| TETR.io        | https://tetr.io/about/api/                                       |   `None`    |   Yes    |
