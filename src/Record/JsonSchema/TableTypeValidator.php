<?php

namespace Flagbit\Bundle\ReferenceEntityTableBundle\Record\JsonSchema;

use Akeneo\ReferenceEntity\Infrastructure\Connector\Api\Record\JsonSchema\RecordValueValidatorInterface;
use Flagbit\Bundle\ReferenceEntityTableBundle\Attribute\TableAttribute;
use JsonSchema\Validator;

class TableTypeValidator implements RecordValueValidatorInterface
{
    /**
     * {@inheritdoc}
     */
    public function validate(array $normalizedRecord): array
    {
        $record = Validator::arrayToObjectRecursive($normalizedRecord);
        $validator = new Validator();
        $validator->validate($record, $this->getJsonSchema());

        return $validator->getErrors();
    }

    public function forAttributeType(): string
    {
        return TableAttribute::class;
    }

    private function getJsonSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'values' => [
                    'type' => 'object',
                    'patternProperties' => [
                        '.+' => [
                            'type'  => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'locale' => [
                                        'type' => ['string', 'null'],
                                    ],
                                    'channel' => [
                                        'type' => ['string', 'null'],
                                    ],
                                    'data' => [
                                        'type' => ['string', 'null'],
                                    ],
                                ],
                                'required' => ['locale', 'channel', 'data'],
                                'additionalProperties' => false,
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
