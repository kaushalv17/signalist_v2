import Link from 'next/link';

export default function FooterLink({ text, linkText, href }: FooterLinkProps) {
  return (
    <p className="text-center text-sm text-gray-500 pt-4">
      {text}{' '}
      <Link href={href} className="footer-link">
        {linkText}
      </Link>
    </p>
  );
}
