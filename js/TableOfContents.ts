import { ScrollIO, Handler } from "@imjasonmiller/scroll-io";

function main(): void {
  // Gather all links to headings in the table of contents
  const toc = [...document.querySelectorAll(".toc__list a")];

  // Return early if this post has no headings in its table of contents
  if (!toc.length) {
    return;
  }

  // Keep track of the previous heading
  let previousIndex = 0;

  const handleIntersect: Handler = ({ index }, entry): void => {
    // If an intersection occurs with one of the article's headings
    // - Remove the `active` class from the previous toc link
    // - Assign the `aative` class to the current toc link
    if (entry.isIntersecting) {
      toc[previousIndex].classList.remove("toc__link--active");
      toc[index].classList.add("toc__link--active");
      previousIndex = index;
    }
  };

  // Select all headings within the article.
  //
  // NOTE: We select all H3, as H1 and H2 are reserved for
  // the site logo and article title respectively.
  const pageHeadings = document.querySelectorAll("h3");

  new ScrollIO(pageHeadings, handleIntersect, {
    range: { steps: 0 },
  });
}

export default main;
