interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: JSX.Element) => JSX.Element;
  elseWrapper?: (children: JSX.Element) => JSX.Element;
  children: JSX.Element;
}

export const ConditionalWrapper = ({
  condition,
  wrapper,
  elseWrapper,
  children,
}: ConditionalWrapperProps): JSX.Element => {
  if (condition) {
    return wrapper(children);
  } else if (elseWrapper) {
    return elseWrapper(children);
  } else {
    return children;
  }
};
