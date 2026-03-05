export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-green-bg">
      <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} LeafLogic. All rights reserved.</p>
        <p className="mt-1">Your trusted indoor plant care resource.</p>
      </div>
    </footer>
  );
}
