/**
 * data-validator.js
 * Validates dashboard data before it's saved to localStorage or Firebase.
 * No external dependencies.
 * Exposes global: window.DataValidator
 *
 * Usage:
 *   var result = DataValidator.validate('task', { name: '', priority: 'urgent' });
 *   if (!result.valid) { showToast(result.firstError); return; }
 *
 *   // Or throw directly in a save function:
 *   DataValidator.validateOrThrow('task', taskData);
 */
(function () {
  'use strict';

  // ── Primitive checkers ─────────────────────────────────────────────────────

  var ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function isNonEmpty(v)       { return typeof v === 'string' && v.trim().length > 0; }
  function isValidDate(v)      { return typeof v === 'string' && ISO_DATE_RE.test(v) && !isNaN(new Date(v).getTime()); }
  function isValidEmail(v)     { return typeof v === 'string' && EMAIL_RE.test(v.trim()); }
  function isPositive(v)       { return typeof v === 'number' && isFinite(v) && v > 0; }
  function isInRange(v, lo, hi){ return typeof v === 'number' && isFinite(v) && v >= lo && v <= hi; }
  function isOptional(v, fn)   { return v == null || v === '' || fn(v); }

  // ── Schemas ────────────────────────────────────────────────────────────────
  // Each field: { required, check(value) → bool, msg }
  // Omit `required` (or set false) for optional fields.

  var SCHEMAS = {

    task: {
      name:     { required: true,
                  check: isNonEmpty,
                  msg:   'Task name can\'t be empty.' },
      priority: { check: function (v) { return ['urgent', 'normal'].indexOf(v) !== -1; },
                  msg:   'Priority must be "urgent" or "normal".' },
      due:      { check: function (v) { return isOptional(v, isValidDate); },
                  msg:   'Due date must be YYYY-MM-DD format.' },
      cat:      { check: isNonEmpty,
                  msg:   'Category can\'t be empty.' }
    },

    reflection: {
      answers: { required: true,
                 check: function (v) {
                   return Array.isArray(v)
                     && v.length > 0
                     && v.every(function (a) { return isNonEmpty(a.q) && isNonEmpty(a.a); });
                 },
                 msg: 'All reflection questions must have an answer.' }
    },

    gymWorkout: {
      name: { required: true, check: isNonEmpty,   msg: 'Workout name is required.' },
      date: { required: true, check: isValidDate,  msg: 'Workout date must be YYYY-MM-DD.' },
      sets: { required: true,
              check: function (v) { return Array.isArray(v) && v.length > 0; },
              msg:   'Add at least one set before saving.' }
    },

    bodyWeight: {
      weight: { required: true, check: isPositive,  msg: 'Body weight must be greater than 0.' },
      date:   { required: true, check: isValidDate, msg: 'Date must be YYYY-MM-DD.' }
    },

    exerciseLog: {
      weight: { required: true, check: isPositive,  msg: 'Weight must be greater than 0.' },
      date:   { required: true, check: isValidDate, msg: 'Date must be YYYY-MM-DD.' }
    },

    financeEntry: {
      amount:   { required: true, check: isPositive,  msg: 'Amount must be greater than 0.' },
      category: { required: true, check: isNonEmpty,  msg: 'Category is required.' },
      date:     { required: true, check: isValidDate, msg: 'Date must be YYYY-MM-DD.' }
    },

    // Ready for when you add Firebase Auth
    userProfile: {
      email:       { check: function (v) { return isOptional(v, isValidEmail); },
                     msg:  'Enter a valid email address.' },
      displayName: { check: function (v) { return isOptional(v, isNonEmpty); },
                     msg:  'Display name can\'t be blank.' }
    }
  };

  // ── ValidationResult ───────────────────────────────────────────────────────

  function ValidationResult(errors) {
    this.valid      = errors.length === 0;
    this.errors     = errors;
    this.firstError = errors[0] || null;
  }

  // ── DataValidator ──────────────────────────────────────────────────────────

  var DataValidator = {

    /**
     * Validate data against a named schema.
     * Returns a ValidationResult — always safe to call, never throws.
     *
     * @param  {string} schemaName  'task' | 'reflection' | 'gymWorkout' |
     *                              'bodyWeight' | 'exerciseLog' | 'financeEntry' | 'userProfile'
     * @param  {object} data
     * @returns {ValidationResult}
     */
    validate: function (schemaName, data) {
      var schema = SCHEMAS[schemaName];
      if (!schema) {
        if (window.ErrorHandler) ErrorHandler.warn('Unknown schema "' + schemaName + '"', 'data-validator');
        return new ValidationResult(['Unknown schema: ' + schemaName]);
      }

      var errors = [];

      Object.keys(schema).forEach(function (field) {
        var rule    = schema[field];
        var value   = data == null ? undefined : data[field];
        var missing = value === null || value === undefined || value === '';

        if (rule.required && missing) {
          errors.push(rule.msg || (field + ' is required.'));
          return;
        }
        if (!missing && rule.check && !rule.check(value)) {
          errors.push(rule.msg || (field + ' is invalid.'));
        }
      });

      if (errors.length > 0 && window.ErrorHandler) {
        ErrorHandler.warn(
          'Validation failed [' + schemaName + ']: ' + errors.join(' | '),
          'data-validator',
          { data: { schema: schemaName, errors: errors } }
        );
      }

      return new ValidationResult(errors);
    },

    /**
     * Validate and throw on first error.
     * Use in save functions — the thrown message is already user-friendly.
     *
     * try {
     *   DataValidator.validateOrThrow('task', taskData);
     *   // ...save...
     * } catch (e) {
     *   showToast(e.message);
     * }
     */
    validateOrThrow: function (schemaName, data) {
      var result = this.validate(schemaName, data);
      if (!result.valid) throw new Error(result.firstError);
    },

    // ── Field helpers for ad-hoc checks ─────────────────────────────────────

    isEmail:    isValidEmail,
    isDate:     isValidDate,
    isPositive: isPositive,
    isNonEmpty: isNonEmpty,
    isInRange:  isInRange,

    /** Add or modify a schema at runtime (e.g. for custom fields). */
    addSchema: function (name, schema) {
      SCHEMAS[name] = schema;
    }
  };

  window.DataValidator = DataValidator;

})();
