import { Component, Renderer2 } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpRightFromSquare, faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-projects',
  imports: [FontAwesomeModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {

  faArrowDown = faChevronDown;
  faGoto = faArrowUpRightFromSquare;

  showArrow = false;
  hideArrow = false;
  scrollListener;

  constructor(private renderer: Renderer2) {
    setTimeout(() => {
      this.showArrow = true;
    }, 3000);

    const screenHeight = window.innerHeight;
    this.scrollListener = renderer.listen('window', 'scroll', e => {
      let ypos = e.target.scrollingElement.scrollTop;

      if (!this.hideArrow && ypos > (2.6 * screenHeight)) {
        this.hideArrow = true
      } else if (this.hideArrow && ypos < (2.6 * screenHeight)) {
        this.hideArrow = false;
      }
    });
  }


  scrollToView() {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
    this.showArrow = false;
  }



  projects: {
    title: string,
    desc: string,
    img: string,
    link: string
  }[] = [
    {
      title: "Recyclorobo.ai",
      desc: "Revolutionizing recycling by leveraging advanced AI & Robotics.",
      img: "projects/recyclorobo.png",
      link: "https://recyclorobo.ai"
    }, {
      title: "Sarcomere Dynamics",
      desc: "Main website for displaying the robotic hand.",
      img: "projects/sarcomere-dynamics.png",
      link: "https://sarcomeredynamics.com"
    }, {
      title: "timesheet",
      desc: "Our time tracking and invoice creation for freelancers.",
      img: "projects/timesheet.png",
      link: "https://timesheet-e8ebf.web.app"
    },
    {
      title: "Platypus Toys",
      desc: "Ecommerce website for selling toys.",
      img: "projects/platypus-toys.png",
      link: "https://platypustoys.com"
    }, 
  ];


  goto(link: string) {
    window.open(link);
  }
}
