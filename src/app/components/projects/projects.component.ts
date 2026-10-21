import { afterNextRender, ChangeDetectorRef, Component, OnDestroy, Renderer2 } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpRightFromSquare, faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-projects',
  imports: [FontAwesomeModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnDestroy {

  faArrowDown = faChevronDown;
  faGoto = faArrowUpRightFromSquare;

  showArrow = false;
  private removeScrollListener: () => void;
  private removeResizeListener: () => void;

  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) {
    this.removeScrollListener = renderer.listen('window', 'scroll', () => this.updateArrowVisibility());
    this.removeResizeListener = renderer.listen('window', 'resize', () => this.updateArrowVisibility());
    afterNextRender(() => {
      this.updateArrowVisibility();
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.removeScrollListener();
    this.removeResizeListener();
  }

  scrollToView(): void {
    document.getElementById("products")?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: "start",
      inline: "nearest"
    });
  }

  openProject(event: MouseEvent, link: string, newTab: boolean): void {
    if (event.button !== 0) return;
    this.navigateProject(link, newTab);
  }

  openProjectFromAuxClick(event: MouseEvent, link: string, newTab: boolean): void {
    if (event.button === 1) {
      event.preventDefault();
      this.navigateProject(link, newTab);
    }
  }

  handleProjectKeydown(event: KeyboardEvent, link: string, newTab: boolean): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.navigateProject(link, newTab);
    }
  }

  private navigateProject(link: string, newTab: boolean): void {
    if (newTab) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      window.location.assign(link);
    }
  }

  handleArrowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.scrollToView();
    }
  }

  private updateArrowVisibility(): void {
    const section = document.getElementById('projects');
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    this.showArrow = bounds.top < window.innerHeight && bounds.bottom > 0;
  }



  projects: {
    title: string,
    desc: string,
    img: string,
    link: string,
    newTab: boolean
  }[] = [
    {
      title: "Recyclorobo.ai",
      desc: "Revolutionizing recycling by leveraging advanced AI & Robotics.",
      img: "projects/recyclorobo.png",
      link: "https://recyclorobo.ai",
      newTab: true
    }, {
      title: "Sarcomere Dynamics",
      desc: "Main website for displaying the robotic hand.",
      img: "projects/sarcomere-dynamics.png",
      link: "https://sarcomeredynamics.com",
      newTab: true
    }, {
      title: "Platypus Toys",
      desc: "Ecommerce website for selling toys.",
      img: "projects/platypus-toys.png",
      link: "https://platypustoys.com",
      newTab: true
    }, 
  ];
}
