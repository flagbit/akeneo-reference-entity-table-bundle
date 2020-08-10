# Flagbit ReferenceEntity TableAttribute for Akeneo PIM

## Key Features

Provides a _table_ as attribute type where you can define a set of columns of different types and validation rules.

#### Column Types

* Text
* Number (Integer or Decimal)
* Simple select
* Simple select (multilanguage)

## Installation

Simply install the package with the following command: 

``` bash
composer require flagbit/reference-entity-table-bundle
```

### Enable the bundle

Enable the bundle in the bundles.php:

``` php
<?php
// config/bundles.php

return [
    // ...
    Flagbit\Bundle\ReferenceEntityTableBundle\FlagbitReferenceEntityTableBundle::class => ['all' => true],
];
```

### Clear cache and build frontend files

After the installation is done, you need to clear the Akeneo PIM cache and create the frontend
files either by using the Makefile or the console commands.

Supported by [Flagbit GmbH & Co. KG](https://www.flagbit.de)
