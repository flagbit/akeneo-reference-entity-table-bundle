<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Property;

use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\CreateTableAttributeCommand;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\Command\EditTableAttributeCommand;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

class TableProperty
{
    /** @var tablePropertyArray */
    private $tableProperty;

    /**
     * @param tablePropertyArray $tableProperty
     */
    private function __construct(array $tableProperty)
    {
        $this->tableProperty = $tableProperty;
    }

    /**
     * @param tablePropertyArray $tableProperty
     * @return self
     */
    public static function fromArray(array $tableProperty): self
    {
        return new self($tableProperty);
    }

    /**
     * @return tablePropertyArray
     */
    public function normalize(): array
    {
        return $this->tableProperty;
    }

    /**
     * @param CreateTableAttributeCommand | EditTableAttributeCommand $command
     * @param ExecutionContextInterface                               $context
     */
    public static function validateProperty($command, ExecutionContextInterface $context): void
    {
        $codes = array_column($command->tableProperty, 'code');

        $uniqueCodes = array_unique($codes);

        $duplicateCodes = array_diff_key($codes, $uniqueCodes);

        if (count($duplicateCodes) !== 0) {
            foreach ($duplicateCodes as $index => $code) {
                $context->buildViolation(
                    'pim_reference_entity.attribute.validation.duplicate_code',
                    ['{{code}}' => $code]
                )
                    ->atPath(sprintf('tableProperty[%d][code]', $index))
                    ->addViolation();
            }
        }
    }
}
