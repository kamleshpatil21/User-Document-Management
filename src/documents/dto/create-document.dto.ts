import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'The name of the document',
    example: 'document.pdf',
  })
  name: string;

  @ApiProperty({
    description: 'The size of the document in bytes',
    example: 1024,
  })
  size: number;

  @ApiProperty({
    description: 'The MIME type of the document',
    example: 'application/pdf',
  })
  type: string;

  @ApiProperty({
    description: 'The file path where the document is stored',
    example: 'uploads/documents/document.pdf',
  })
  path: string;
  
}
