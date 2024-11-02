---
layout: _
title: A Brief Introduction to Common Database Models & Graph Databases
description: An article & keynote I shared with my colleagues
date: 2022-09-21
categories:
  - database
  - graph database
  - slides
  - arrangodb
published: true
thumbnail: /uploads/graph-db.png
slides: https://timjjting.github.io/A-Brief-Introduction-to-Common-Database-Models
---

A database model is a data model that determines the logical structure of a database.[^1] One can also consider it an abstraction to represent things or entities. There are several database models and each suits different data types and usage scenarios. This article gives a brief introduction and comparison to common ones.

**Outline**

1. Common Database Models
    - Relational
    - Document
    - Other Database Models Worth Mentioning
2. Graph Database
    - Use cases
    - DBMS & Query Languages
    - Demo
3. Appendix: DBMS and Database Models

## 1. Common Database Models

In this section, we will walk through common database models.

### 1.1 Relational

#### Data Model

A relational database is a ledger-styled data storage model, where each **table** is a class, each **row** in a table is an entity or a transaction, and each **column** in a table is a property that represents an entity or a transaction.

#### Relations

To represent relations in a relational database, you will need to apply **foreign key constraints** to table columns. When querying across tables (following relationships), you will need to **join** tables. When querying in a highly normalized schema, several joins are expected.

#### Structured Query Language

To query a relational database, **SQL(Structured Query Language)** is the most universal approach, as the language has been standardized, although SQL codes usually have to be revised when migrating from one to another.

### 1.2 Document

> The terminology here is based on **MongoDB**, you might find some differences if you use other document databases.

#### Data Model

A document database is a document-styled data storage model, where each **collection** is a class, each **document** in a collection is an entity or a transaction, and each **field** in a document is a property that represents an entity or a transaction. Unlike relational databases, documents from the same collection are not required to share the same structure (which means, field sets from two different documents might be different, too), although some DBMS allows you to specify a structured schema to a collection as all RDBMSs do.

#### Hierarchical Data Storage

Unlike relation databases where every query returns a tabular result, data storage and returns in document databases can be **hierarchical**, that is, having an entity inside an entity, or nested.

#### Lookups

To traverse relations in a document database, one writes **lookup pipelines** (as in MongoDB), which is to perform nested queries and then aggregate for every found document, which returns a set of nested documents.

### 1.3 Other Database Models Worth Mentioning

#### Key-value Store

A **key-value store** is a dictionary-like database, which can be regarded as an **associative array** of **objects** or **records**. Each object might have different **fields**. To access an **object**, one uses a **key** which uniquely identifies the object. One of the most famous implementations for the key-value store is **Redis**.

#### Wide Column Store

A **wide column store** is just like a relational database, except columns may vary across rows. The most famous implementations are **HBase** and **Cassandra**.

## 2. Graph Database

### 2.1 Data Model

A graph database (GDB) is a database that uses **graph** structures for semantic queries with **nodes**, **edges**, and **properties** to represent and store data.[^2] Although all GDB implementations the graph structure, the data model can vary across databases. While some use a structured tabular store like a relational database, some are unstructured like a key-value structure, and some are in-between (semi-structured).

### 2.2 Use cases

A graph database is especially powerful when handling queries that involve traversing relations, for example:

- path finding
- social networking
- recommendation systems
- data lineage

Such queries are typically hard to implement in other database models because their structures and query languages are not designed for such cases.

### 2.3 GDBMSs & Query Languages

Unlike relational databases, there is no standard query language that can be used across all graph databases. While some graph databases support querying with SQL-like syntax, some have their languages, and some even support multiple languages. The table below shows a list of the most popular graph databases and their query language.

| Graph Database | Query Language |
| -------- | -------- |
| Neo4j     | Cypher     |
| Amazon Neptune     | Gremlin / openCypher / SPARQL     |
| JanusGraph     | Gremlin     |
| ArangoDB*     | AQL     |
| OrientDB**     | Extended SQL     |
| Azure Cosmos DB***     | SQL / Gremlin / CQL / Mongo Shell     |
| SurrealDB****     | SurrealQL     |
| Dgraph | GraphQL***** |

> \* ArangoDB is a multimodel database.  
> \** OrientDB is a multimodel database.  
> \*** Azure CosmosDB is a multimodel database.  
> \**** SurrealDB is a multimodel database.  
> \***** GraphQL is not a graph database, nor a query language especially designed for any graph database. The "Graph" in its name has nothing to do with the graph we are talking about here.

### 2.4 Demo

#### ArangoDB Example

```text
Find all possible flight connections from Taoyuan International Airport to the nearest airport
from Santa Claus’ official hometown, with no more than 2 transfers. Also, these airports should
have VIP lounges, and I don’t want to be flying with Turkish Airlines, United Airlines, or any LCC.
```

The question above can be answered with the AQL below:

```aql
LET santa_airport = (
    FOR airport IN airports
    FILTER GEO_DISTANCE(25.5, 66.32) < 500000 LIMIT 1
    RETURN airport._id
)
FOR airport IN airports
  FILTER airport._key == “TPE"
    FOR vertex, edge, path IN 1..2 OUTBOUND airport flights
      FILTER vertex._id == santa_airport && vertex.vip == true
      FILTER edge.airline NOT IN [“Turkish”, “United”] && NOT edge.is_lcc
      RETURN path
```

## Appendix: DBMS and Database Models[^3]

|  | Relational | Document | Graph |
| -------- | -------- | -------- | -------- |
| Data Model     | Structured     | Structured / Unstructured  | Structured / Unstructured / Semi-structured |
| Scalability | Vertical | Horizontal | Vertical / Horizontal |
| Data Storage | Fixed rows and columns | Documents | Nodes and Edges |
| Schema | Pre-defined | Dynamic / Pre-defined | None |
| Hierarchical Data Storage | Not suitable | Suitable | Not suitable |
| Use Cases | Atomicity, consistency, isolation, durability (ACID) compliance, data warehouse, online analytical processing (OLAP), online transaction processing (OLTP), and structured data analysis | Content management, real-time big data, and user profiles | Fraud detection, social networking, and recommendation engines |

[^1]: [Database Model](https://en.wikipedia.org/wiki/Database_model)
[^2]: Bourbakis, Nikolaos G. (1998). Artificial Intelligence and Automation. World Scientific. p. 381. ISBN 9789810226374. Retrieved 2018-04-20.
[^3]: Source: https://www.g2.com/articles/document-databases