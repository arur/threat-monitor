from django.http import HttpResponse
import os, json

from django.shortcuts import render

def index(request):
    return render(request, 'threat/index.html')

def ajax_threats(request):

    path_to_json = '.'
    json_files = [pos_json for pos_json in os.listdir(path_to_json) if pos_json.endswith('.json')]
    print(json_files)

    json_datas = []
    for js in json_files:
        with open(os.path.join(path_to_json, js)) as json_file:
            json_text = json.load(json_file)
            json_datas += json_text
            json_file.close()

    return HttpResponse(json.dumps(json_datas), content_type='application/json')