# Flagbit ReferenceEntity TableAttribute for Akeneo PIM

[![Frontend Tests](https://github.com/flagbit/akeneo-reference-entity-table-bundle/actions/workflows/frontend-tests.yml/badge.svg?branch=master)](https://github.com/flagbit/akeneo-reference-entity-table-bundle/actions/workflows/frontend-tests.yml)
[![Backend Tests](https://github.com/flagbit/akeneo-reference-entity-table-bundle/actions/workflows/backend-tests.yml/badge.svg?branch=master)](https://github.com/flagbit/akeneo-reference-entity-table-bundle/actions/workflows/backend-tests.yml)
[![PHP Code Analysis + Style](https://github.com/flagbit/akeneo-reference-entity-table-bundle/actions/workflows/backend-analysis.yml/badge.svg?branch=master)](https://github.com/flagbit/akeneo-reference-entity-table-bundle/actions/workflows/backend-analysis.yml)
[![Frontend Code Analysis + Style](https://github.com/flagbit/akeneo-reference-entity-table-bundle/actions/workflows/frontend-analysis.yml/badge.svg?branch=master)](https://github.com/flagbit/akeneo-reference-entity-table-bundle/actions/workflows/frontend-analysis.yml)
[![codecov](https://codecov.io/gh/flagbit/akeneo-reference-entity-table-bundle/branch/master/graph/badge.svg?token=6F67B93XA9)](https://codecov.io/gh/flagbit/akeneo-reference-entity-table-bundle)

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
composer require flagbit/akeneo-reference-entity-table-bundle
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
