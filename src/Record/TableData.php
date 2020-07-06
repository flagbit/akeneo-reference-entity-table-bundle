<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Record;

use Akeneo\ReferenceEntity\Domain\Model\Record\Value\ValueDataInterface;
use Webmozart\Assert\Assert;

class TableData implements ValueDataInterface
{
    /** @var array */
    private $tableValue;

    private function __construct(array $tableValue)
    {
        $this->tableValue = $tableValue;
    }

    /**
     * @return array
     */
    public function normalize()
    {
        return $this->tableValue;
    }

    public static function createFromNormalize($normalizedData): ValueDataInterface
    {
        Assert::isArray($normalizedData, 'Normalized data should be an array');

        return new self($normalizedData);
    }

    public static function fromArray(array $tableValue)
    {
        return new self($tableValue);
    }
}
