function success(data, message) {
  return {
    code: 200,
    message: message || '',
    data: data
  }
}

function fail(code, message) {
  return {
    code: code,
    message: message || '',
    data: null
  }
}

module.exports = app => {
  const express = require('express');
  const router = express.Router()
  const assert = require('http-assert')
  const Article = require('../../models/Article')
  const Tag = require('../../models/Tag')


  router.get('/article/list', async (req, res) => {
    const list = await Article.find().populate('tag').limit(10)
    res.send(success(list))
  })

  router.get('/article/list/:id', async (req, res) => {
    // const list = await Article.find({"tag":{"$elemMatch":{"name": req.params.name}}}).populate('tag')
    const list = await Article.find({'tag': req.params.id}).populate('tag')
    res.send(success(list))
  })

  router.get('/article/:id', async (req, res) => {
    const article = await Article.findById({_id: req.params.id}).populate('tag')
    res.send(success(article))
  })

  router.get('/tag/list', async (req, res) => {
    const list = await Tag.find().populate('parent').limit(10)
    res.send(success(list))
  })

  // 获取博客文章/评论数量
  router.get('/user/count', async (req, res) => {
    const articleCount = await Article.count()
    const shuoshuoCount = 0
    const evalutaionCount = 0
    let userCount = {
      articleCount,
      shuoshuoCount,
      evalutaionCount,
    }
    res.send(success(userCount)) 
  })

  // 评论文章
  const Evaluation = require('../../models/Evaluation')
  router.post('/evaluate', async (req, res) => {
    assert(req.body.articleId, 403, '缺失参数_articleId')
    assert(req.body.nickname, 403, '请填写昵称')
    assert(req.body.email, 403, '请填写邮箱')
    const model = await Evaluation.create(req.body)
    res.send(success(model, '评论成功'))
  })
  // 评论列表
  router.get('/evaluate/list', async (req, res) => {
    const list = await Evaluation.find().limit(10)
    res.send(success(list))
  })

  // 博客信息
  const BlogInfo = require('../../models/BlogInfo')
  router.post('/blogInfo', async (req, res) => {
    const info = await BlogInfo.find()
    res.send(success(info[0]))
  })

  app.use('/web/api', router)

  // 错误处理
  // app.use(async (err, req, res, next) => {
  //     res.status(200).send(fail(err.statusCode, err.message))
  // })
}