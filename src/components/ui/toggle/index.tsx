import React, { ComponentPropsWithRef } from "react";

import { Circle, Input, Label } from "./style";

interface Props extends ComponentPropsWithRef<"input"> {
  loading?: boolean;
}

// TODO OPLU-180
// this component is a placeholder, proper implementation should be done in above-mentioned ticket

function Toggle({ loading, ...props }: Props) {
  return (
    <Label disabled={props.disabled} isLoading={loading} isChecked={props.checked}>
      <Input type="checkbox" {...props} disabled={props.disabled || loading} />
      <Circle isLoading={loading} isChecked={props.checked} />
    </Label>
  );
}

export default Toggle;
