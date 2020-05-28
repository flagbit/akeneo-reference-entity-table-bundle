<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Attribute;

use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeCode;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeIdentifier;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeIsRequired;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeOrder;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeValuePerChannel;
use Akeneo\ReferenceEntity\Domain\Model\Attribute\AttributeValuePerLocale;
use Akeneo\ReferenceEntity\Domain\Model\LabelCollection;
use Akeneo\ReferenceEntity\Domain\Model\ReferenceEntity\ReferenceEntityIdentifier;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttributeHydrator;
use PhpSpec\ObjectBehavior;

class TableAttributeHydratorSpec extends ObjectBehavior
{
    public function let(Connection $sqlConnection, AbstractPlatform $platform)
    {
        $sqlConnection->getDatabasePlatform()->willReturn($platform);

        $this->beConstructedWith($sqlConnection);
    }

    public function it_is_initializable(): void
    {
        $this->shouldHaveType(TableAttributeHydrator::class);
    }

    public function it_does_support_attribute_type(): void
    {
        $this->supports(['attribute_type' => 'flagbit_table'])->shouldReturn(true);
    }

    public function it_does_not_support_attribute_type(): void
    {
        $this->supports([])->shouldReturn(false);
        $this->supports(['attribute_type' => 'flagbit_table1'])->shouldReturn(false);
    }

    public function it_does_not_hydrate_invalid_row(): void
    {
        $row = [];

        $this->shouldThrow(\RuntimeException::class)->duringHydrate($row);
    }

    public function it_does_hydrate_row(AbstractPlatform $platform): void
    {
        $expected = TableAttribute::create(
            AttributeIdentifier::fromString('id'),
            ReferenceEntityIdentifier::fromString('reference_entity_identifier'),
            AttributeCode::fromString('code'),
            LabelCollection::fromArray(['de_DE' => 'fuu', 'en_US' => 'foo']),
            AttributeOrder::fromInteger(1),
            AttributeIsRequired::fromBoolean(false),
            AttributeValuePerChannel::fromBoolean(false),
            AttributeValuePerLocale::fromBoolean(false)
        );

        $platform->convertFromBoolean(false)->willReturn(false);

        $row = [
            'identifier' => 'id',
            'reference_entity_identifier' => 'reference_entity_identifier',
            'code' => 'code',
            'labels' => '{"de_DE": "fuu", "en_US": "foo"}',
            'attribute_order' => 1,
            'is_required' => false,
            'value_per_locale' => false,
            'value_per_channel' => false,
            'attribute_type' => 'flagbit_table',
            'additional_properties' => '{}',
        ];

        $this->hydrate($row)->shouldBeLike($expected);
    }
}
