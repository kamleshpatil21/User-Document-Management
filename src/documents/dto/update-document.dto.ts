import { ApiProperty } from '@nestjs/swagger';

export class UpdateDocumentDto {
  @ApiProperty({
    description: 'The name of the document',
    example: 'updated-document.pdf',
    required: false, // Indicates that this field is optional
  })
  name?: string;

  @ApiProperty({
    description: 'The size of the document in bytes',
    example: 2048,
    required: false, // Indicates that this field is optional
  })
  size?: number;

  @ApiProperty({
    description: 'The MIME type of the document',
    example: 'application/pdf',
    required: false, // Indicates that this field is optional
  })
  type?: string;

  @ApiProperty({
    description: 'The file path where the document is stored',
    example: 'uploads/documents/updated-document.pdf',
    required: false, // Indicates that this field is optional
  })
  path?: string;
}
