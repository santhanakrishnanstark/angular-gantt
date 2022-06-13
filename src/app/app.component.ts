import { Component, OnInit } from "@angular/core";

import $ from "jquery";
// import ganttData from "../assets/gantt/data.js";
// import "../assets/gantt/ganttView.js";

import { ganttView } from "../assets/gantt/jquery.ganttView.js";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "gantt-chart-angular";
  ganttData = [
    {
      id: 1,
      name: "Feature 1",
      series: [
        {
          name: "Planned",
          start: new Date(2010, 0, 1),
          end: new Date(2010, 0, 3),
        },
        {
          name: "Actual",
          start: new Date(2010, 0, 2),
          end: new Date(2010, 0, 5),
          color: "#f0f0f0",
        },
      ],
    },
    {
      id: 2,
      name: "Feature 2",
      series: [
        {
          name: "Planned",
          start: new Date(2010, 0, 5),
          end: new Date(2010, 0, 20),
        },
        {
          name: "Actual",
          start: new Date(2010, 0, 6),
          end: new Date(2010, 0, 17),
          color: "#f0f0f0",
        },
        {
          name: "Projected",
          start: new Date(2010, 0, 6),
          end: new Date(2010, 0, 17),
          color: "#e0e0e0",
        },
      ],
    },
    {
      id: 3,
      name: "Feature 3",
      series: [
        {
          name: "Planned",
          start: new Date(2010, 0, 11),
          end: new Date(2010, 1, 3),
        },
        {
          name: "Actual",
          start: new Date(2010, 0, 15),
          end: new Date(2010, 1, 3),
          color: "#f0f0f0",
        },
      ],
    },
    {
      id: 4,
      name: "Feature 4",
      series: [
        {
          name: "Planned",
          start: new Date(2010, 1, 1),
          end: new Date(2010, 1, 3),
        },
        {
          name: "Actual",
          start: new Date(2010, 1, 1),
          end: new Date(2010, 1, 5),
          color: "#f0f0f0",
        },
      ],
    },
    {
      id: 5,
      name: "Feature 5",
      series: [
        {
          name: "Planned",
          start: new Date(2010, 2, 1),
          end: new Date(2010, 3, 20),
        },
        {
          name: "Actual",
          start: new Date(2010, 2, 1),
          end: new Date(2010, 3, 26),
          color: "#f0f0f0",
        },
      ],
    },
    {
      id: 6,
      name: "Feature 6",
      series: [
        {
          name: "Planned",
          start: new Date(2010, 0, 5),
          end: new Date(2010, 0, 20),
        },
        {
          name: "Actual",
          start: new Date(2010, 0, 6),
          end: new Date(2010, 0, 17),
          color: "#f0f0f0",
        },
        {
          name: "Projected",
          start: new Date(2010, 0, 6),
          end: new Date(2010, 0, 20),
          color: "#e0e0e0",
        },
      ],
    },
    {
      id: 7,
      name: "Feature 7",
      series: [
        {
          name: "Planned",
          start: new Date(2010, 0, 11),
          end: new Date(2010, 1, 3),
        },
      ],
    },
    {
      id: 8,
      name: "Feature 8",
      series: [
        {
          name: "Planned",
          start: new Date(2010, 1, 1),
          end: new Date(2010, 1, 3),
        },
        {
          name: "Actual",
          start: new Date(2010, 1, 1),
          end: new Date(2010, 1, 5),
          color: "#f0f0f0",
        },
      ],
    },
  ];

  constructor() {
    console.log($("body"));
  }

  ngOnInit() {
    ganttView($, "#ganttChart", {
      data: this.ganttData,
      slideWidth: 900,
    });
    // $("#ganttChart").ganttView({
    //   data: this.ganttData,
    //   slideWidth: 900,
    //   // behavior: {
    //   //   onClick: function (data) {
    //   //     var msg =
    //   //       "You clicked on an event: { start: " +
    //   //       data.start.toString("M/d/yyyy") +
    //   //       ", end: " +
    //   //       data.end.toString("M/d/yyyy") +
    //   //       " }";
    //   //     $("#eventMessage").text(msg);
    //   //   },
    //   //   onResize: function (data) {
    //   //     var msg =
    //   //       "You resized an event: { start: " +
    //   //       data.start.toString("M/d/yyyy") +
    //   //       ", end: " +
    //   //       data.end.toString("M/d/yyyy") +
    //   //       " }";
    //   //     $("#eventMessage").text(msg);
    //   //   },
    //   //   onDrag: function (data) {
    //   //     var msg =
    //   //       "You dragged an event: { start: " +
    //   //       data.start.toString("M/d/yyyy") +
    //   //       ", end: " +
    //   //       data.end.toString("M/d/yyyy") +
    //   //       " }";
    //   //     $("#eventMessage").text(msg);
    //   //   },
    //   // },
    // });
  }
}
