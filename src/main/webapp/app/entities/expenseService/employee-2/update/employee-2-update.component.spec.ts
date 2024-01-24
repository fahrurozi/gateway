import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Employee2Service } from '../service/employee-2.service';
import { IEmployee2 } from '../employee-2.model';
import { Employee2FormService } from './employee-2-form.service';

import { Employee2UpdateComponent } from './employee-2-update.component';

describe('Employee2 Management Update Component', () => {
  let comp: Employee2UpdateComponent;
  let fixture: ComponentFixture<Employee2UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let employee2FormService: Employee2FormService;
  let employee2Service: Employee2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), Employee2UpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(Employee2UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Employee2UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    employee2FormService = TestBed.inject(Employee2FormService);
    employee2Service = TestBed.inject(Employee2Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const employee2: IEmployee2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

      activatedRoute.data = of({ employee2 });
      comp.ngOnInit();

      expect(comp.employee2).toEqual(employee2);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployee2>>();
      const employee2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(employee2FormService, 'getEmployee2').mockReturnValue(employee2);
      jest.spyOn(employee2Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee2 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employee2 }));
      saveSubject.complete();

      // THEN
      expect(employee2FormService.getEmployee2).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(employee2Service.update).toHaveBeenCalledWith(expect.objectContaining(employee2));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployee2>>();
      const employee2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(employee2FormService, 'getEmployee2').mockReturnValue({ id: null });
      jest.spyOn(employee2Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee2: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employee2 }));
      saveSubject.complete();

      // THEN
      expect(employee2FormService.getEmployee2).toHaveBeenCalled();
      expect(employee2Service.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployee2>>();
      const employee2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(employee2Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee2 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(employee2Service.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
