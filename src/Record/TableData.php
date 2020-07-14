<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Record;

use Akeneo\ReferenceEntity\Domain\Model\Record\Value\ValueDataInterface;
use Webmozart\Assert\Assert;

class TableData implements ValueDataInterface
{
    /** @var array<mixed> */
    private $tableValue;

    /**
     * @param array<mixed> $tableValue
     */
    private function __construct(array $tableValue)
    {
        $this->tableValue = $tableValue;
    }

    /**
     * @return array<mixed>
     */
    public function normalize()
    {
        return $this->tableValue;
    }

    /**
     * @param array<mixed> $normalizedData
     *
     * @return ValueDataInterface
     */
    public static function createFromNormalize($normalizedData): ValueDataInterface
    {
        Assert::isArray($normalizedData, 'Normalized data should be an array');

        return new self($normalizedData);
    }

    /**
     * @param array<mixed> $tableValue
     *
     * @return TableData
     */
    public static function fromArray(array $tableValue)
    {
        return new self($tableValue);
    }
}
