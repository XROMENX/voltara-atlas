import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isSameOrigin, validRecord} from '../app/api/records/validation.ts';
const valid={kind:'note',title:'Core',body:'Personal notes',equipmentId:'power-transformer'};
test('accepts valid note and bookmark payloads',()=>{assert.ok(validRecord(valid));assert.ok(validRecord({...valid,kind:'bookmark',body:''}));});
test('rejects malformed payloads and unsupported equipment',()=>{for(const value of [null,[],{}, {...valid,kind:'admin'},{...valid,equipmentId:'other'},{...valid,title:' '},{...valid,title:'a'.repeat(161)},{...valid,body:'a'.repeat(10001)},{...valid,id:'../../other'},{...valid,componentId:'<script>'}])assert.equal(validRecord(value),false);});
test('requires explicit same-origin evidence for writes',()=>{const url='https://voltara.example/api/records';assert.ok(isSameOrigin(new Request(url,{headers:{origin:'https://voltara.example'}})));for(const headers of [{},{origin:'https://evil.example'},{origin:'null'},{origin:'https://voltara.example','sec-fetch-site':'cross-site'}])assert.equal(isSameOrigin(new Request(url,{headers})),false);});
