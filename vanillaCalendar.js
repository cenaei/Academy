/**
 * VanillaCalendar - Modernized & Accessible Vanilla Calendar
 * Security hardened: Zero unsafe innerHTML, event delegation, WCAG keyboard navigation
 */
(function (global) {
  'use strict';

  var vanillaCalendar = {
    month: null,
    next: null,
    previous: null,
    label: null,
    pickedLabel: null,
    date: new Date(),
    todaysDate: new Date(),
    options: {
      disablePastDays: false,
      onSelect: null
    },

    monthsAsString: function (m) {
      return [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ][m];
    },

    init: function (userOptions) {
      if (userOptions) {
        for (var key in userOptions) {
          if (Object.prototype.hasOwnProperty.call(userOptions, key)) {
            this.options[key] = userOptions[key];
          }
        }
      }

      this.month = document.querySelector('[data-calendar-area="month"]');
      this.next = document.querySelector('[data-calendar-toggle="next"]');
      this.previous = document.querySelector('[data-calendar-toggle="previous"]');
      this.label = document.querySelector('[data-calendar-label="month"]');
      this.pickedLabel = document.querySelector('[data-calendar-label="picked"]');

      if (!this.month || !this.next || !this.previous || !this.label) {
        return; // Safe exit if elements are not present
      }

      // Start on the first of current month
      this.date.setDate(1);
      this.createMonth();
      this.bindListeners();
    },

    bindListeners: function () {
      var self = this;

      this.next.addEventListener('click', function (e) {
        e.preventDefault();
        self.clearCalendar();
        self.date.setMonth(self.date.getMonth() + 1);
        self.createMonth();
      });

      this.previous.addEventListener('click', function (e) {
        e.preventDefault();
        self.clearCalendar();
        self.date.setMonth(self.date.getMonth() - 1);
        self.createMonth();
      });

      // Delegated click listener on the month container (Prevents listener leaks!)
      this.month.addEventListener('click', function (e) {
        var targetDate = e.target.closest('[data-calendar-status="active"]');
        if (!targetDate) return;
        self.selectDate(targetDate);
      });

      // Keyboard navigation support on dates
      this.month.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          var targetDate = e.target.closest('[data-calendar-status="active"]');
          if (targetDate) {
            e.preventDefault();
            self.selectDate(targetDate);
          }
        }
      });
    },

    selectDate: function (dateEl) {
      var dateStr = dateEl.getAttribute('data-calendar-date');
      if (this.pickedLabel) {
        var parsedDate = new Date(dateStr);
        var formatted = isNaN(parsedDate.getTime())
          ? dateStr
          : parsedDate.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
        this.pickedLabel.textContent = formatted;
      }

      var allSelected = this.month.querySelectorAll('.vcal-date--selected');
      for (var i = 0; i < allSelected.length; i++) {
        allSelected[i].classList.remove('vcal-date--selected');
        allSelected[i].removeAttribute('aria-selected');
      }

      dateEl.classList.add('vcal-date--selected');
      dateEl.setAttribute('aria-selected', 'true');

      if (typeof this.options.onSelect === 'function') {
        this.options.onSelect(dateStr, dateEl);
      }
    },

    createDay: function (dayNum, dayOfWeek, year, monthIndex) {
      var cell = document.createElement('div');
      cell.className = 'vcal-date';

      var span = document.createElement('span');
      span.textContent = String(dayNum);

      var currentDate = new Date(year, monthIndex, dayNum);
      cell.setAttribute('data-calendar-date', currentDate.toISOString());

      // Adjust first day offset (Monday start: Mon=0, Sun=6)
      if (dayNum === 1) {
        var offsetIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        cell.style.marginLeft = (offsetIndex * 14.28) + '%';
      }

      var isPast = this.options.disablePastDays &&
        currentDate.setHours(0, 0, 0, 0) < new Date(this.todaysDate).setHours(0, 0, 0, 0);

      if (isPast) {
        cell.classList.add('vcal-date--disabled');
        cell.setAttribute('aria-disabled', 'true');
      } else {
        cell.classList.add('vcal-date--active');
        cell.setAttribute('data-calendar-status', 'active');
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('role', 'button');
        cell.setAttribute(
          'aria-label',
          this.monthsAsString(monthIndex) + ' ' + dayNum + ', ' + year
        );
      }

      var isToday = (
        currentDate.getDate() === this.todaysDate.getDate() &&
        currentDate.getMonth() === this.todaysDate.getMonth() &&
        currentDate.getFullYear() === this.todaysDate.getFullYear()
      );

      if (isToday) {
        cell.classList.add('vcal-date--today');
      }

      cell.appendChild(span);
      this.month.appendChild(cell);
    },

    createMonth: function () {
      var currentMonth = this.date.getMonth();
      var currentYear = this.date.getFullYear();

      // Determine days in current month
      var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      for (var day = 1; day <= daysInMonth; day++) {
        var dayDate = new Date(currentYear, currentMonth, day);
        this.createDay(day, dayDate.getDay(), currentYear, currentMonth);
      }

      this.label.textContent = this.monthsAsString(currentMonth) + ' ' + currentYear;
    },

    clearCalendar: function () {
      if (this.month) {
        while (this.month.firstChild) {
          this.month.removeChild(this.month.firstChild);
        }
      }
    }
  };

  global.vanillaCalendar = vanillaCalendar;
})(typeof window !== 'undefined' ? window : this);
