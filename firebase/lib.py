from __future__ import annotations
from typing import List, override, Any
import json
import time
import requests

proxies = {'https':"http://disrct:etsbosch2025@10.224.200.26:8080",'http':"http://disrct:etsbosch2025@10.224.200.26:8080"}



class PostGuy:
    def __init__(self, name):
        self.name : str = name

class PostGuys:
    postguys : List[PostGuy] = []
    def __init__(self, apiUrl):
        self.apiUrl = apiUrl
    def add(self, name : PostGuy):
        self.postguys.append(PostGuy(name))

    @override
    def __getitem__(self, key : Any) -> (Any | None):
        if isinstance(key, slice):
            start : int = key.start if key.start != None else 0
            end : int = key.stop if key.stop != None else len(self)
            length : int = end - start
            sliced : PostGuys = PostGuys(length)
            for i in range(length):
                sliced[i] = self[i+start]
            return sliced

        if key >= len(self.postguys) or key < 0:
            return None
        return self.postguys[key]
    
    @override
    def __setitem__(self, index : int, valor : Any) -> None:
        if index >= len(self.postguys) or index < 0:
            return
        self.postguys[index] = valor

    @override
    def __len__(self) -> int:
        return len(self.postguys)

    @override
    def __iter__(self) -> PostGuys:
        self.iteracao_atual = 0
        return self
    
    @override
    def __next__(self) -> Any:
        if self.iteracao_atual >= len(self.postguys):
            raise StopIteration
        valor = self.postguys[self.iteracao_atual]
        self.iteracao_atual += 1
        return valor
    

class FireKeeper:
    def __init__(self, url : str, user: str, apiUrl : str, watch_time : int=1):
        self.url = url
        self.user = user
        self.watch_time = watch_time
        self.postguys = PostGuys(apiUrl)
        self.last_value = None
    
    def get(self, endpoint : str):
        response = requests.get(f"{self.url}/{self.user}/{endpoint}.json",proxies=proxies)
        return response.json()
    
    def AddListener(self, name):
        self.postguys.add(name)

    def ListenAll(self):
        data = {}
        for guy in self.postguys:
            data[guy.name] = self.get(guy.name)

        """
        request = {
            "nome" : data["nome"]
            "nome" : data["nome"]
            "nome" : data["nome"]
        }
        """
        request = data
        response = requests.post(self.postguys.apiUrl, json=request)
        if response.status_code < 400:
            print(f"[UPDATE ON SERVER]\t|\tstatus code = {response.status_code}\t|\tresponse = {response.text}")
        else:
            print(f"[ERROR ON UPDATE]\t|\tstatus code = {response.status_code}\t|\tresponse = {response.text}")
    
        time.sleep(self.watch_time * 60)

    def ListenOnChange(self):
        print("\r\033[KListening...", end="", flush=True)
        
        data = {}
        for guy in self.postguys:
            data[guy.name] = self.get(guy.name)
            
        """
        request = {
            "nome" : data["nome"]
            "nome" : data["nome"]
            "nome" : data["nome"]
        }
        """
        
        request = data
        if self.last_value != data:
            base = "[HAS CHANGED]"
            try:
                print(f"\n{base} Requesting...", end="", flush=True)
                response = requests.post(self.postguys.apiUrl, json=request)
                if response.status_code == 200:
                    print(f"\r\033[K{base} [UPDATE ON SERVER]", flush=True)
                else:
                    print(f"\r\033[K{base} [ERROR ON UPDATE]",response.text, flush=True)
                # time.sleep(self.watch_time * 60)
            except:
                print(f"\r\033[K{base} [NO SERVER FOUND]", flush=True)

        self.last_value = data