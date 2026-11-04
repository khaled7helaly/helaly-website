function Container({
  children,
  className = "",
  as: Element = "div",
  ...props
}) {
  return (
    <Element
      className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 ${className}`}
      {...props}
    >
      {children}
    </Element>
  );
}

export default Container;