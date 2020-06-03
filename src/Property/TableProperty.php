<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Property;

class TableProperty
{
    /** @var string */
    private $tableButton;

    private function __construct(string $tableButton)
    {
        $this->tableButton = $tableButton;
    }

    public static function fromString(string $tableButton): self
    {
        return new self($tableButton);
    }

    public function normalize(): string
    {
        return $this->tableButton;
    }
}
