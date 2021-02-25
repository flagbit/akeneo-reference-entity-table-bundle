<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Record;

use Akeneo\ReferenceEntity\Domain\Model\Attribute\AbstractAttribute;
// phpcs:ignore
use Akeneo\ReferenceEntity\Infrastructure\Persistence\Sql\Record\Hydrator\Transformer\ConnectorValueTransformerInterface;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Webmozart\Assert\Assert;

class TableConnectorValueTransformer implements ConnectorValueTransformerInterface
{
    public function supports(AbstractAttribute $attribute): bool
    {
        return $attribute instanceof TableAttribute;
    }

    /**
     * @param array<mixed>      $normalizedValue
     * @param AbstractAttribute $attribute
     *
     * @return array{'locale': string|null, 'channel': string|null, 'data': array<mixed>}
     */
    public function transform(array $normalizedValue, AbstractAttribute $attribute): array
    {
        Assert::true($this->supports($attribute));

        return [
            'locale'  => $normalizedValue['locale'],
            'channel' => $normalizedValue['channel'],
            'data'    => $this->filterRows($normalizedValue['data'], $attribute),
        ];
    }

    /**
     * Filters out unknown codes from table data
     *
     * @param array<array<string, mixed>> $normalizedData
     * @param AbstractAttribute           $attribute
     *
     * @return array<array<string, mixed>>
     */
    private function filterRows(array $normalizedData, AbstractAttribute $attribute): array
    {
        $tableProperty = $attribute->normalize()['table_property'];

        $codeStructure = static function (array $row) {
            return $row['code'];
        };

        $allowedCodes = array_flip(array_map($codeStructure, $tableProperty));

        $data = [];
        foreach ($normalizedData as $dataRow) {
            $data[] = array_intersect_key($dataRow, $allowedCodes);
        }

        return $data;
    }
}
