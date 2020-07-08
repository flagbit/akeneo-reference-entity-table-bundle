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

    public function transform(array $normalizedValue, AbstractAttribute $attribute): array
    {
        Assert::true($this->supports($attribute));

        return [
            'locale'  => $normalizedValue['locale'],
            'channel' => $normalizedValue['channel'],
            'data'    => $normalizedValue['data'],
        ];
    }
}
