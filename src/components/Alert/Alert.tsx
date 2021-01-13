import React from "react";
import classnames from "classnames";
import { motion } from "framer-motion";
import { IVariant, IAnimationBase } from "~/src/utility/interfaces";
import { createAnimationDefinition } from "~/src/utility/animation";

interface AlertProps extends IVariant, IAnimationBase {}

const Alert: React.FunctionComponent<AlertProps> = ({ variant = "primary", children, animationType = "fadeIn", unusedProp }) => {
  const classesString = classnames("alert", `alert-${variant}`);
  return (
    <motion.div className={classesString} {...createAnimationDefinition({ animationType })}>
      {children}
    </motion.div>
  );
};

export default Alert;
