import { describe, expect, it } from 'vitest';
import { inferDiscipline, isProductTrioRole } from './roleFilter';

describe('roleFilter', () => {
  it.each([
    ['Product Manager', undefined, 'Product'],
    ['Staff Technical Product Manager', 'Engineering', 'Product'],
    ['Mission Manager - Navy', 'Federal Delivery', 'Product'],
    ['Solutions Architect - Pre-Sales', 'Federal Sales', 'Product'],
    ['Product Designer', 'R&D', 'Design'],
    ['Product Desinger', undefined, 'Design'],
    ['Design Engineer', undefined, 'Design'],
    ['Software Developer', undefined, 'Engineering'],
    ['Senior Platform Engineer', 'Federal Delivery', 'Engineering'],
    ['Engineering Manager, Mission Agents', 'Product Engineering', 'Engineering'],
  ])('classifies %s as %s', (title, department, expected) => {
    expect(inferDiscipline({ title, department })).toBe(expected);
  });

  it.each([
    ['Account Executive - Army', 'Federal Sales'],
    ['Technical Recruiter', 'People'],
    ['Controller', 'Finance'],
    ['Electronic Technician', 'Engineering'],
    ['IT Engineer - Hardware', 'IT & Facility'],
    ['Sales Engineer', 'Federal Sales'],
    ['Physical Therapist', undefined],
  ])('filters out %s', (title, department) => {
    expect(isProductTrioRole({ title, department })).toBe(false);
  });
});
