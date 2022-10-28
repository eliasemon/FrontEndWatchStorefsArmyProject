import styled from "styled-components";

export const BaseButton = styled.button`
  background-color: ${({ bg, theme }) =>
    bg === "primary" ? theme?.color?.primary : theme?.color?.secondary};

  border: 1px solid
    ${({ bg, theme }) =>
      bg === "primary" ? theme?.color?.secondary : theme?.color?.primary};

  color: ${({ bg, theme }) =>
    bg === "primary" ? theme?.color?.secondary : theme?.color?.primary};

  font-size: ${({ fontSize, theme }) => theme?.fontSizes[fontSize] ?? "1rem"};

  padding: ${({ shape, theme }) =>
    shape === "square" ? "0.5rem" : "0.25rem 0.75rem"};

  border-radius: 10px;
  cursor: pointer;
  transition: 0.5s;

  & > * {
    padding-top: 0.2em;
    margin-left: 0.2em;
  }

  &:hover {
    background-color: ${({ theme }) => theme?.color?.hover};
    color: ${({ theme }) => theme?.color?.white};
    border: 1px solid ${({ theme }) => theme?.color?.hover};
  }
`;

const Button = ({ children, bg, fontSize, shape }) => {
  return (
    <BaseButton bg={bg} fontSize={fontSize} shape={shape}>
      {children}
    </BaseButton>
  );
};

export default Button;