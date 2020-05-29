<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Record;

use Akeneo\ReferenceEntity\Domain\Model\Record\Value\ValueDataInterface;
use Webmozart\Assert\Assert;

class TableData implements ValueDataInterface
{
    /** @var string */
    private $tableValue;

    private function __construct(string $tableValue)
    {
        $this->tableValue = $tableValue;
    }

    /**
     * @return string
     */
    public function normalize()
    {
        return $this->tableValue;
    }

    public static function createFromNormalize($normalizedData): ValueDataInterface
    {
        Assert::string($normalizedData, 'Normalized data should be a string');

        return new self($normalizedData);
    }

    public static function fromString(string $tableValue)
    {
        return new self($tableValue);
    }
}
