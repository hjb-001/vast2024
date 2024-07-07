def success_message(data):
    return {
        "message": "success",
        "status": 200,
        "data": data
    }


def false_message(msg):
    return {
        "message": msg,
        "status": 400,
    }
