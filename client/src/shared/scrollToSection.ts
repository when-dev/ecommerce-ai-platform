export function scrollToSection(sectionId: string, offset = 96) {
  const element = document.getElementById(sectionId);

  if (!element) {
    return;
  }

  const elementTop = element.getBoundingClientRect().top + window.scrollY;
  const targetPosition = elementTop - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });
}