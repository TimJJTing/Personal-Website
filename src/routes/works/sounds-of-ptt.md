---
layout: _
title: Sounds of PTT
description: Web opinion and sentiment sonification
year: 2018
categories:
  - nlp
  - dsp
  - sonification
  - vue
  - docker
  - django
  - pandas
  - numpy
  - python
  - celery
  - gcp
  - nginx
  - scrapy
  - postgresql
  - redis
  - jieba
  - bootstrap
  - web crawling
published: true
thumbnail: /uploads/ptt-sounds.png
banner: /uploads/ptt-sounds.png
images:
  - image: /uploads/ptt-sounds.png
    caption: Fig. 1 - Interface
additionalLinks:
  - url: https://github.com/TimJJTing/ptt-sounds
    title: Frontend source
  - url: https://github.com/TimJJTing/ptt-sounds-docker-backend
    title: Backend source
---

Sounds of PTT is a web application that can turn an article on PTT into audible frequencies. 

## Idea

[PTT](https://www.ptt.cc/bbs/index.html) is the most popular BBS in Taiwan, where one can find the public’s opinion for almost any given topic. With public’s opinion structuralized in a series of short comments and “push/boo” tags, one can read through the discussion thread to catch the public’s sentiment orientations of a topic.

However, reading is not the only way we sense this universe. Just like this [inspiring project](https://www.nasa.gov/feature/goddard/2018/sounds-of-the-sun) by NASA, what if we could actually “hear” public's sentiment orientations? Does it feel different from reading? Can we compose meaningful sounds from public's opinions? Will a positive rated article sounds better than a negative rated article? If the author and commenters of an article start a band, how will their music sound like? This web application is designed to answer these questions.

## How It Works in General
A User first enters a PTT article URL in the `Frontend`. When the `Backend API` receives a valid PTT article URL, it dispatches a `Crawler`, which crawls and re-structuralizes article contents for the `Sound Maker`. The `Sound Maker` then can process structuralized data with 3 steps, tokenization, quantization (based on sentiment polarity of words), and finally sonification. After the procedure is done, a media file will be generated and therefore can be referenced via the `Frontend`.

> This project is archived

## Technology Used
### Frontend
- Vue.js
- Vue router
- Bootstrap

### Backend
#### Hosting/Environment
- Google Cloud Compute Engine
- Docker-Compose

#### Web Server
- Nginx

#### API
- Django
- Django rest framework
- Celery

#### Crawler
- Scrapy/Scrapinghub

#### Sound Maker
##### Tokenization
- pandas
- jseg/jieba
##### Quantization
- numpy
- ANTUSD
##### Sonification
- thinkdsp (with some customized code)

#### Database
- Postgresql

#### Messaging/Cache Backend
- Redis

## Credits
### Inspiration and Acknowledgements
- [Sounds of the Sun](https://www.nasa.gov/feature/goddard/2018/sounds-of-the-sun)
- [Prof. Feng-Yang Kuo](https://www.mis.nsysu.edu.tw/~bkuo/)
- [Yen-tzu Chang](http://www.changyentzu.com/)
### Resources
- [Allen B. Downey](https://github.com/AllenDowney/ThinkDSP): The author of Think DSP, an awesome book for learning digital signal processing.
- [NLPSA](http://academiasinicanlplab.github.io/): Where I acquire ANTUSD for this project.
- [Jseg](https://github.com/amigcamel/Jseg): A better choice for Chinese tokenization in this project.
### References
- [Dockerizing a Full-stack Application](https://medium.com/@matthew.rosendin/dockerizing-a-full-stack-application-89a7d69e11e9)
- [nginx配置location总结及rewrite规则写法](http://seanlook.com/2015/05/17/nginx-location-rewrite/)
- [Voltage-Controlled Oscillator (VCO)](http://synthesizeracademy.com/voltage-controlled-oscillator-vco/)
- [Setup caching in Django With Redis](https://boostlog.io/@nixus89896/setup-caching-in-django-with-redis-5abb7d060814730093a2eebe)
- [Wave Generation in Python](http://blog.acipo.com/wave-generation-in-python/)
