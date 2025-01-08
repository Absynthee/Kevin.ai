document.addEventListener("DOMContentLoaded", function () {
  // Register GSAP plugins
  gsap.registerPlugin(Draggable, InertiaPlugin);

  // Initialize variables for the descriptions, items, and carousel wrapper
  let descriptions = gsap.utils.toArray(".carousel-txt-list .cms-desc");
  let items = gsap.utils.toArray(".quote-list .quote-item");
  let projectImages = document.getElementById("slider-wrap");
  let radius = projectImages ? projectImages.offsetWidth / 2 : 0;

  // Update radius on window resize
  window.addEventListener("resize", () => {
    radius = projectImages.offsetWidth / 2;
    carousel.resize(radius, radius);
  });

  // Make the first description visible
  gsap.set(descriptions, { autoAlpha: 0 });
  gsap.set(descriptions[0], { autoAlpha: 1 });

  // Build the carousel with custom options
  let carousel = buildCarousel(items, {
    radiusX: radius,
    radiusY: radius,
    activeAngle: -90, // Active item is positioned at the top
    draggable: true,
    onClick(element, self) {
      self.to(
        element,
        {
          duration: 1.5,
          ease: "power1.inOut",
        },
        "short"
      ); // Smooth transition on click
    },
    onActivate(element, self) {
      element.classList.add("active"); // Add 'active' class when item is selected
    },
    onDeactivate(element, self) {
      element.classList.remove("active"); // Remove 'active' class when item is deactivated
    },
    onStart(element, self) {
      // Hide description of the current item when dragging starts
      gsap.to(descriptions[items.indexOf(element)], {
        autoAlpha: 0,
        duration: 0.25,
        overwrite: "auto",
      });
    },
    onStop(element, self) {
      // Show description of the current item when dragging stops
      gsap.to(descriptions[items.indexOf(element)], {
        autoAlpha: 1,
        overwrite: "auto",
      });
    },
  });

  // Event listeners for navigation buttons
  document
    .querySelector("#next")
    .addEventListener("click", () => carousel.next());
  document
    .querySelector("#prev")
    .addEventListener("click", () => carousel.previous());

  // Function to build the carousel with the given options
  function buildCarousel(
    targets,
    {
      radiusX = 200,
      radiusY = 200,
      activeAngle = -90,
      activeElement,
      onClick,
      onActivate,
      onDeactivate,
      onStart,
      onStop,
      draggable,
      autoAdvance,
    }
  ) {
    // Convert targets to array and set initial positioning
    targets = gsap.utils.toArray(targets);
    gsap.set(targets, {
      xPercent: -50,
      x: 0,
      yPercent: -50,
      y: 0,
    });

    // Set constants for angle calculations and event types
    let DEG2RAD = Math.PI / 180,
      eventTypes = (
        "ontouchstart" in document.documentElement
          ? "touchstart,touchmove,touchcancel,touchend"
          : !("onpointerdown" in document.documentElement)
          ? "mousedown,mousemove,mouseup,mouseup"
          : "pointerdown,pointermove,pointercancel,pointerup"
      ).split(","),
      round = (value) => Math.round(value * 10000) / 10000,
      tempDiv = document.createElement("div"),
      quantity = targets.length,
      angleInc = 360 / quantity,
      wrap = gsap.utils.wrap(0, quantity),
      angleWrap = gsap.utils.wrap(0, 360),
      rotation = 0,
      dragged,
      onPressRotation,
      autoAdvanceCall =
        autoAdvance &&
        gsap.delayedCall(parseFloat(autoAdvance) || 2, () => {
          self.next();
          autoAdvanceCall.restart(true);
        }),
      xSetters = targets.map((el) => gsap.quickSetter(el, "x", "px")),
      ySetters = targets.map((el) => gsap.quickSetter(el, "y", "px")),
      self = {
        // Method to set rotation of the carousel
        rotation(value) {
          if (arguments.length) {
            let prevActive = activeElement;
            rotation = angleWrap(value);
            activeElement = targets[wrap(Math.round(-value / angleInc))];
            self.render();
            if (prevActive !== activeElement) {
              onDeactivate && prevActive && onDeactivate(prevActive, self);
              onActivate && onActivate(activeElement, self);
            }
          }
          return rotation;
        },
        // Method to resize the carousel
        resize(rx, ry) {
          radiusX = rx;
          radiusY = ry;
          self.render();
        },
        // Render the carousel items' positions based on the current rotation
        render() {
          let inc = angleInc * DEG2RAD,
            a = (rotation + activeAngle) * DEG2RAD,
            i = 0;
          for (; i < quantity; i++) {
            xSetters[i](round(Math.cos(a) * radiusX));
            ySetters[i](round(Math.sin(a) * radiusY));
            a += inc;
          }
        },
        // Get or set the active element
        activeElement(value) {
          if (arguments.length) {
            self.rotation(self.elementRotation(value));
          }
          return activeElement;
        },
        // Calculate the rotation for a specific element
        elementRotation(element) {
          let index = targets.indexOf(gsap.utils.toArray(element)[0]);
          return (quantity - index) * angleInc;
        },
        // Transition to a specific element or rotation
        to(elOrRotation, vars, direction) {
          vars = vars || {};
          vars.rotation =
            typeof elOrRotation === "number"
              ? elOrRotation
              : self.elementRotation(elOrRotation) || parseFloat(elOrRotation);
          vars.overwrite = true;
          let { onUpdate, onComplete } = vars,
            _onStart = vars.onStart;
          autoAdvanceCall && autoAdvanceCall.pause();
          vars.onStart = function () {
            onStart && onStart(activeElement, self);
            _onStart && _onStart.call(this);
          };
          vars.onComplete = function () {
            onStop && onStop(activeElement, self);
            onComplete && onComplete.call(this);
            autoAdvanceCall && autoAdvanceCall.restart(true);
          };
          if (direction) {
            let getter = gsap.getProperty(tempDiv);
            vars.onUpdate = function () {
              self.rotation(getter("rotation"));
              onUpdate && onUpdate.call(this);
            };
            vars.rotation += "_" + direction;
            return gsap.fromTo(
              tempDiv,
              {
                rotation: rotation,
              },
              vars
            );
          }
          return gsap.to(self, vars);
        },
        // Transition to the next element
        next(vars, direction) {
          let element = targets[wrap(targets.indexOf(activeElement) + 1)];
          self.to(element, vars, direction || "ccw");
        },
        // Transition to the previous element
        previous(vars, direction) {
          let element = targets[wrap(targets.indexOf(activeElement) - 1)];
          self.to(element, vars, direction || "cw");
        },
        // Clean up and remove event listeners
        kill() {
          targets.forEach((el) => {
            el.removeEventListener("click", _onClick);
            el.removeEventListener(eventTypes[0], onPress);
            el.removeEventListener(eventTypes[2], onRelease);
            el.removeEventListener(eventTypes[3], onRelease);
          });
          gsap.killTweensOf(self);
          tempDiv.parentNode && tempDiv.parentNode.removeChild(tempDiv);
          autoAdvanceCall && autoAdvanceCall.kill();
          draggable && draggable.kill();
        },
        autoAdvance: autoAdvanceCall,
      },
      // Event handler for clicking on an item
      _onClick = (e) => {
        if (!dragged) {
          autoAdvanceCall && autoAdvanceCall.restart(true);
          onClick && onClick(e.currentTarget, self);
        }
      },
      // Event handler for starting the drag
      onPress = (e) => {
        onPressRotation = rotation;
        gsap.set(tempDiv, { rotation: rotation });
        autoAdvanceCall && autoAdvanceCall.pause();
        gsap.killTweensOf(self);
        draggable.startDrag(e);
        dragged = false;
      },
      // Event handler for releasing the drag
      onRelease = (e) => {
        draggable.endDrag(e);
        if (rotation === onPressRotation) {
          autoAdvanceCall && autoAdvanceCall.restart(true);
          draggable.tween && draggable.tween.kill();
          _onClick(e);
        }
      },
      // Sync the draggable rotation with the carousel
      syncDraggable = () => {
        if (!dragged) {
          onStart && onStart(activeElement, self);
          dragged = true;
        }
        self.rotation(draggable.rotation);
      };

    // Append a temporary div for rotation calculations
    targets[0].parentNode.appendChild(tempDiv);
    gsap.set(tempDiv, {
      visibility: "hidden",
      position: "absolute",
      width: 0,
      height: 0,
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
    });

    // Add event listeners for each carousel item
    targets.forEach((el) => {
      if (draggable) {
        el.addEventListener(eventTypes[0], onPress);
        el.addEventListener(eventTypes[2], onRelease);
        el.addEventListener(eventTypes[3], onRelease);
      } else {
        el.addEventListener("click", _onClick);
      }
    });

    // Enable draggable functionality if required
    self.snap = angleInc;
    draggable &&
      (self.draggable = draggable =
        Draggable.create(tempDiv, {
          type: "rotation",
          snap: gsap.utils.snap(angleInc),
          inertia: true,
          onThrowComplete: () => {
            autoAdvanceCall && autoAdvanceCall.restart(true);
            onStop && onStop(activeElement, self);
          },
          onThrowUpdate: syncDraggable,
          onDrag: syncDraggable,
        })[0]);

    // Set the initial active element
    self.activeElement(gsap.utils.toArray(activeElement)[0] || targets[0]);
    return self;
  }
});
