import { Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export type Transformer<Input = unknown, Output = unknown> = (
  rawData: Input,
) => Output;

@Injectable()
export class ZodPipe<Input = unknown, Output = unknown>
  implements PipeTransform
{
  constructor(
    private readonly schema: ZodSchema,
    private readonly transformer?: Transformer<Input, Output>,
  ) {}

  transform(value: Input): Output {
    return this.schema.parse(
      typeof this.transformer === "function" ? this.transformer(value) : value,
    );
  }
}
