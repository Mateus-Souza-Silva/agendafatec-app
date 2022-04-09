import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../contato.service';
import { Contato } from './contato';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario!: FormGroup;
  contatos: Contato[] = [];
  colunas = ['id', 'nome', 'email', 'favorito', 'excluir'];

  constructor(
    private service: ContatoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.createForms();
    this.findAll();
  }

  createForms(){
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    })
  }
  

  submit() {
    const formValues = this.formulario.value;
    const contato: Contato = new Contato(formValues.nome, formValues.email);

    this.service.save(contato).subscribe(resposta => {
      this.snackBar.open('Contato adicionado com sucesso!', 'Sucesso',{
        duration: 2000
      })
      this.formulario.reset;
      let lista: Contato[] = [...this.contatos, resposta]
      this.contatos = lista;
    })
  }

  findAll(){
    this.service.list().subscribe(resposta => 
      this.contatos = resposta)
  }

  favorite(contato: Contato){
    this.service.favorite(contato).subscribe(resposta =>{
      contato.favorito = !contato.favorito
    })
  }

  delete(contato: Contato){
    if (window.confirm('Deseja realmente exlcuir esse contato?')){
      this.service.delete(contato).subscribe(resposta =>{
        this.findAll();
      })
    }
  }
}
