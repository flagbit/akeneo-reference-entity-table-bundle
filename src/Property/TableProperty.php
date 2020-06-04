<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Property;

class TableProperty
{
    /** @var array */
    private $tableProperty;

    private function __construct(array $tableProperty)
    {
        $this->tableProperty = $tableProperty;
    }

    public static function fromArray(array $tableProperty): self
    {
        return new self($tableProperty);
    }

    public function normalize(): array
    {
        return $this->tableProperty;
    }
}
