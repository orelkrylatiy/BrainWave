interface Props {
  className?: string;
  text: string;
}

export const Text = ({ className, text }: Props) => {
  return <span className={className}>{text}</span>;
};
