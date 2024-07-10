# Gamiverse Bot

[![Invite Discord](https://img.shields.io/badge/-Invite%20Bot-404eed?style=flat&logo=discord&logoColor=white)](https://discord.com/api/oauth2/authorize?client_id=1074237343306883082&permissions=139586956352&scope=bot)
[![Invite Telegram](https://img.shields.io/badge/-Chat%20With%20Bot-24a1dd?style=flat&logo=telegram&logoColor=white)](https://t.me/gamiverse_bot)

Gamiverse is a bot that can get player stats from various games and display them in a simple and easy to read format.

## Commands

### General

| Command    | Desciption                                |
| ---------- | ----------------------------------------- |
| `/help`    | Get help for the bot                      |
| `/contact` | Get contact information for the developer |
| `/docs`    | Get documentation for the bot             |

### Game

| Game             | Command                         | Type         | Discord | Telegram | Status             |
| ---------------- | ------------------------------- | ------------ | :-----: | :------: | ------------------ |
| Brawl Stars      | `/bs <tag>`                     | API          |  `Yes`  |  `Yes`   | Temporarily Remove |
| Clash of Clans   | `/coc <tag>`                    | Web Scraping |  `Yes`  |   `No`   | OK                 |
| Clash Royale     | `/cr <tag>`                     | Web Scraping |  `Yes`  |   `No`   | OK                 |
| Chess.com        | `/chess <username>`             | API          |  `Yes`  |  `Yes`   | OK                 |
| Destiny 2        | `/d2 <platform> <membershipId>` | API          |  `Yes`  |  `Yes`   | OK                 |
| Fate/Grand Order | `/fgo <server> <userId>`        | Web Scraping |  `Yes`  |   `No`   | OK                 |
| Genshin Impact   | `/genshin <uid>`                | Web Scraping |  `Yes`  |   `No`   | OK                 |
| Honkai Star Rail | `/hsr <uid>`                    | Web Scraping |  `Yes`  |   `No`   | OK                 |
| osu!             | `/osu <id>`                     | API          |  `Yes`  |   `No`   | OK                 |
| PUBG             | `/pubg <platform> <accountId>`  | API          |  `Yes`  |  `Yes`   | OK                 |
| TETR.io          | `/tetrio <username>`            | API          |  `Yes`  |  `Yes`   | OK                 |

> **Note:** Brawl Stars commands are temporarily removed due to how the API works. The API requires an IP address to be whitelisted before it can be used and when restarting the bot, the IP address changes so I have to manually delete the old API key and create a new one.

## API

| Game        | Documentation                                                    |    Auth     | Official |
| ----------- | ---------------------------------------------------------------- | :---------: | :------: |
| Brawl Stars | https://developer.brawlstars.com/#/documentation                 |  `Bearer`   |   Yes    |
| Chess.com   | https://www.chess.com/news/view/published-data-api               |   `None`    |   Yes    |
| Destiny 2   | https://bungie-net.github.io/multi/                              | `x-api-key` |   Yes    |
| osu!        | https://osu.ppy.sh/docs/index.html                               |  `Bearer`   |   Yes    |
| PUBG        | https://documentation.playbattlegrounds.com/en/introduction.html |  `Bearer`   |   Yes    |
| TETR.io     | https://tetr.io/about/api/                                       |   `None`    |   Yes    |

## Web Scraping

| Game             | Website                    | Official |
| ---------------- | -------------------------- | :------: |
| Clash of Clans   | https://www.coc-stats.net/ |    No    |
| Clash Royale     | https://royaleapi.com/     |    No    |
| Fate/Grand Order | https://rayshift.io/       |    No    |
| Genshin Impact   | https://enka.network/      |    No    |
| Honkai Star Rail | https://enka.network/      |    No    |

> **Here is a warning**. When compared to using APIs for data retrieval, web scraping has several disadvantages:
>
> -   **Reliability:** Web scraping can break if the website's structure changes.
> -   **Legal Issues:** Web scraping may pose legal risks and raise ethical concerns.
> -   **Performance:** It can be slower and less efficient than APIs.
> -   **Maintenance:** Frequent updates are needed to adapt to site changes.
> -   **Limited Data:** May provide less structured and comprehensive data.

> **Additional Notes:**
>
> -   `/fgo` command still has a bug where if the user id for master is not found, the bot does not provide any response and might crash the program.
