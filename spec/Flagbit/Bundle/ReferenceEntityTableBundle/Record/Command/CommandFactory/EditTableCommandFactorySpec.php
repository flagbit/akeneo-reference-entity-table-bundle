<?php

namespace spec\Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command\CommandFactory;

use Akeneo\ReferenceEntity\Domain\Model\Attribute\AbstractAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command\CommandFactory\EditTableCommandFactory;
use Flagbit\Bundle\ReferenceEntityTableBundle\Record\Command\EditTableValueCommand;
use PhpSpec\ObjectBehavior;

class EditTableCommandFactorySpec extends ObjectBehavior
{
    public function it_is_initializable(): void
    {
        $this->shouldHaveType(EditTableCommandFactory::class);
    }

    public function it_does_support_command(TableAttribute $attribute): void
    {
        $this->supports($attribute, ['data' => 'data'])->shouldReturn(true);
    }

    public function it_does_not_support_command(TableAttribute $attribute, AbstractAttribute $abstractAttribute): void
    {
        $this->supports($attribute, ['data' => ''])->shouldReturn(false);
        $this->supports($abstractAttribute, ['data' => 'data'])->shouldReturn(false);
        $this->supports($abstractAttribute, ['data' => null])->shouldReturn(false);
    }

    public function it_creates_command(TableAttribute $attribute): void
    {
        $command = new EditTableValueCommand(
            $attribute->getWrappedObject(),
            'channel',
            'locale',
            'data'
        );

        $normalizedValue = [
            'channel' => 'channel',
            'locale' => 'locale',
            'data' => 'data',
        ];

        $this->create($attribute, $normalizedValue)->shouldBeLike($command);
    }
}
