import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CastorAi } from './pages/castor-ai/castor-ai';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'castor', component: CastorAi }
];
