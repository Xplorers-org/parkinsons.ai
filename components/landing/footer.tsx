import React from "react";

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <>
      <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
        <p> <em>

          Parkinson's AI.<br />
            &copy; {currentYear} developed by Xplorers. All rights reserved.
          
        </em>
        </p>
      </footer>
    </>
  );
}

export default Footer;
