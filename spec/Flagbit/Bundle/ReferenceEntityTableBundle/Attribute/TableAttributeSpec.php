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
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CreateTableAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use PhpSpec\ObjectBehavior;

class TableAttributeSpec extends ObjectBehavior
{
    public function let(
        AttributeIdentifier $identifier,
        AttributeOrder $order
    ): void {

        $this->beConstructedThrough('create', [
            $identifier,
            ReferenceEntityIdentifier::fromString('referenceEntityIdentifier'),
            AttributeCode::fromString('code'),
            LabelCollection::fromArray(['de_DE' => 'fuu', 'en_US' => 'foo']),
            $order,
            AttributeIsRequired::fromBoolean(false),
            AttributeValuePerChannel::fromBoolean(false),
            AttributeValuePerLocale::fromBoolean(false)
        ]);
    }

    public function it_is_initializable(): void
    {
        $this->shouldBeAnInstanceOf(TableAttribute::class);
    }

    public function it_returns_type(): void
    {
        $this->getType()->shouldReturn('flagbit_table');
    }

    public function it_contains_expected_values(
        AttributeIdentifier $identifier,
        AttributeOrder $order
    ): void {

        $this->getCode()->shouldBeLike(AttributeCode::fromString('code'));
        $this->getIdentifier()->shouldBe($identifier);
        $this->getReferenceEntityIdentifier()->shouldBeLike(ReferenceEntityIdentifier::fromString('referenceEntityIdentifier'));
        $this->getCode()->shouldBeLike(AttributeCode::fromString('code'));
        $this->getLabel('de_DE')->shouldReturn('fuu');
        $this->getLabelCodes()->shouldReturn(['de_DE', 'en_US']);
        $this->getOrder()->shouldBe($order);
        $this->hasValuePerChannel()->shouldReturn(false);
        $this->hasValuePerLocale()->shouldReturn(false);
    }

    public function it_normalized_values(
        AttributeIdentifier $identifier,
        AttributeOrder $order
    ): void {

        $identifier->__toString()->willReturn('id');
        $order->intValue()->willReturn(42);

        $this->normalize()->shouldReturn([
            'identifier' => 'id',
            'reference_entity_identifier' => 'referenceEntityIdentifier',
            'code' => 'code',
            'labels' => ['de_DE' => 'fuu', 'en_US' => 'foo'],
            'order' => 42,
            'is_required' => false,
            'value_per_channel' => false,
            'value_per_locale' => false,
            'type' => 'flagbit_table',
        ]);
    }
}
