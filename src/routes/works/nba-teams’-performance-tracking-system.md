---
layout: _
title: NBA Teams’ Performance Tracking System
description: The NBA Teams’ Performance Tracking System is a project aims to
  help users to track the performance of NBA teams from 2000 to 2009.
year: 2016
categories:
  - data visualization
  - d3.js
  - frontend
published: true
thumbnail: /uploads/nba-pts-2.png
banner: /uploads/nba-pts-2.png
images:
  - image: /uploads/nba-pts-2.png
    caption: Fig. 1 - Interface
additionalLinks:
  - url: https://timjjting.github.io/NBA-Teams-PTS/
    title: Demo
  - url: https://github.com/TimJJTing/NBA-Teams-PTS
    title: Source
---
The NBA Teams’ Performance Tracking System is a project aims to help users to track the performance of NBA teams from 2000 to 2009. With the assistance of this system, users are able to quickly become aware of win ranks of NBA teams during this 10 years’ period, the overall trend and also the team players’ information. The system requirements, also known as functional requirements, of the project are interactive exploration and filtering techniques.  

This is a semester project of the course Information Visualization (364.029) 
presented in summer 2016 by JIE-TING JIANG and PORNPAN SONGPRASOP under the supervision of [Univ.-Prof. DI Dr. Marc Streit](https://www.jku.at/en/institute-of-computer-graphics/about-us/team/marc-streit/).

## What is the Dataset About?
The dataset used in this project is two collections of related dataset of NBA players and 33 NBA teams regular season records from 1946 to 2009. It was retrieved from [https://www.basketball-reference.com/](https://www.basketball-reference.com/).  
The following data and abbreviations are retrieved and used in this project:

Abbreviation| Stands for
------------|:------
Firstname   | First name of a player  
Lastname    | Last name of a player  
Team        | A team that palyer plays for  
Gp          | Game points  
pts         | Total points  
won         | Total games won  
lost        | Total games lost  
fta         | Free Throw Attempted  
fga         | Field Goal Attempted  
to          | Turnover  
oreb        | Offensive Rebounds  

Beside the existing data, four new data types were fostered:  
  
Abbreviation| Stands for  
------------|:------  
WinRate     | A percentage of total win games divided by total games  
WrRank      | A position based on winRate  
Name        | First name and last name of a player  
Effi        | Efficiency of a player or a team on a particular season  
  
Efficiency is calculated by using this formula: `( pts * 100 ) / ( ( fta * 0.44 ) + fga + to – oreb )`. The formula is taken from http://www.databasebasketball.com/about/aboutstats.htm and is computed on a per season basis.

## User Tasks
Talking about user tasks, a question the come in to our mind was what every user would want to be fully aware of through the observation. The following is the list that we believe that users expect to able to accomplish after using our work:
 - Be able to know how proficiently NBA teams and NBA player has carried out
 - Be able to compare the win rank of NBA teams from 2000 to 2009
 - Be informed the number of winning games and losing games of a particular team in a particular season
 - Be able to compare the efficiency of the best team, the worst team and a chosen team

## The Solution Dashboard
The way this project was implemented can be divided in to 2 perspectives: lay out of the dashboard and technical.  

### Layout view perspective
The NBA team records are outputted as graphs and table in such a way that the important aspects are addressing splitting both the vertical and horizontal space so that the information can be easily read by the user.  
  
In order to make the win rank table display size to be fit with monitor screen fully, the win rank table presents only up to 20 records at a time.  
  
Different color is used in parallel coordinate and pie chart to distinct a team from other team and winning game from losing game, respectively. This is to establish identity of different NBA teams and to make out the difference between game results. Different brightness of a color is also used for the same purpose in the scatter plot and bar chart.  
  
The bar chart has the arrangement of team efficiencies in relation to each other according to their efficiencies. Besides the best team, the worst team and the interesting team’s efficiency, the average efficiency of that season was added to tell how good the team actually was.  

### Technical perspective
The project mainly relies on building a web page using html, CSS, JavaScript, jQuery d3.js, and SVG. Also, we referred a parallel coordinate d3 library from https://syntagmatic.github.io/parallel-coordinates/ to implement the teams’ performance graph. In additional, an extra .css file from Bootstrap is used for a better layout.  
  
The main user actions here are analyzing the existing information. With reference to our project, users will be able to discover new information. They can also identify their target team trends, compare it with other team and get a summary of all possible teams’ performance.  

## How Does the Solution Enable Users to Answer the Tasks?
To display the changes of data continuously over time, line charts are the best. It clearly shows how well teams perform over the 10 years’ period and the overall trends the teams’ performance.  
  
To present the win ranks of NBA teams, a table is needed. Even though users will take longer time to understand clearly ranks of the teams, the table presents precise information to users.  
  
Taking the same result into consideration, players’ efficiency and total points that players made were revealed in a scatter plot instead. The scatter plot shows all possible relations between the number of plays with player efficient. More information about a player is shown in a small box when a mouse icon is over circle in the scatter plot.  
  
A pie chart is in the dashboard to allow users to be perceived the number of winning games and losing games. We picked this as being the best of alternatives because it visualizes the record in proportional to the quantity it presents.  
  
Teams’ efficiency is readily seen in a bar chart. The chart covers the efficiency of the best team, the worst team and an interested team and the average efficiency of the same season. Despite the fact that bar charts are the best chart to track changes of data over time, a bar chart is an alternative. The bar chart shows comparisons among team efficiency and amount of stuff is also measured here.  

## Further Plans
The system was implemented in summer 2016, where Bootstrap 4 and D3v5.js were not even exist yet. A major upgrade and reconstruction is planned to take the advantage of the newest features of both frameworks such as `flexbox` and `promise`.
